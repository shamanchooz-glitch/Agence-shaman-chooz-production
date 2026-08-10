/**
 * Cloud Functions — Agence Shaman Chooz Production (version simplifiée)
 * -----------------------------------------------------------------------
 * UNE SEULE fonction, déclenchée sur le journal d'activité qui existe déjà
 * dans l'application (collection "journal" — chaque fiche candidat,
 * placement ou employeur y ajoute automatiquement une ligne à sa création).
 *
 * Elle envoie une notification push à tous les appareils administrateur/
 * superviseur enregistrés — même si leur application est complètement
 * fermée — dès qu'un AGENT (pas vous) enregistre quelque chose.
 *
 * Marche à suivre pour le déployer : voir GUIDE-NOTIFICATIONS-PUSH.md
 * (une seule fonction à créer, pas trois).
 */
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");

admin.initializeApp();
setGlobalOptions({ region: "us-central1", maxInstances: 10 });

/** Envoie une notification à tous les appareils admin/superviseur enregistrés
 * (collection "fcmTokens"), et nettoie automatiquement les jetons expirés. */
async function envoyerAuxAdmins(titre, corps) {
  const snap = await admin.firestore().collection("fcmTokens").get();
  const tokens = snap.docs.map((d) => d.id).filter(Boolean);
  if (tokens.length === 0) {
    console.log("Aucun appareil admin enregistré pour recevoir la notification.");
    return;
  }
  const message = {
    notification: { title: titre, body: corps },
    tokens,
    webpush: { notification: { icon: "icon-192.png" } },
  };
  try {
    const resp = await admin.messaging().sendEachForMulticast(message);
    const jetonsInvalides = [];
    resp.responses.forEach((r, i) => {
      if (!r.success) jetonsInvalides.push(tokens[i]);
    });
    if (jetonsInvalides.length) {
      await Promise.all(
        jetonsInvalides.map((t) =>
          admin.firestore().collection("fcmTokens").doc(t).delete().catch(() => {})
        )
      );
      console.log(`Jetons invalides nettoyés : ${jetonsInvalides.length}`);
    }
  } catch (e) {
    console.error("Erreur d'envoi des notifications :", e);
  }
}

exports.onJournalEntryCreated = onDocumentCreated("journal/{id}", async (event) => {
  const data = event.data.data();
  const agent = (data && data.agent) || "";
  const type = (data && data.type) || "";
  const label = (data && data.label) || "";

  // On ne notifie que pour les créations de fiches (pas les mises à jour,
  // notes ou actualités), et jamais pour vos propres actions.
  if (!["candidat", "placement", "employeur"].includes(type)) return;
  if (label.includes("mis à jour")) return;
  if (!agent || agent === "Administrateur") return;

  const titres = {
    candidat: "Nouveau candidat(e) enregistré(e)",
    placement: "Nouveau placement enregistré",
    employeur: "Nouvel employeur enregistré",
  };

  await envoyerAuxAdmins(titres[type] || "Nouvelle activité", `${label} — par ${agent}`);
});
