# Notifications push — même application fermée (Firebase Cloud Messaging)

Ce guide met en place le dernier niveau de notification : recevoir une alerte
sur votre téléphone **même si l'application est complètement fermée ou
l'écran verrouillé**, comme avec WhatsApp.

**Bonne nouvelle : ce n'est pas obligatoire.** Sans cette étape, vous
recevez déjà les alertes en temps réel tant que l'application reste ouverte
(même en arrière-plan) sur votre téléphone — voir « Outils de gestion →
Notifications » dans l'app. Faites cette étape uniquement le jour où vous
êtes prêt, tranquillement, sans pression. Rien ne casse entre-temps.

**Ce guide a été simplifié au maximum : une seule fonction à créer** (au
lieu de trois), grâce au journal d'activité qui existe déjà dans
l'application.

---

## Ce qu'il faut avant de commencer

- Une **carte Visa/Mastercard acceptée par Google Cloud** (voir notre
  échange précédent si vous n'en avez pas encore — carte virtuelle Wave,
  carte d'un proche, etc.). Elle sert uniquement de garantie : pour votre
  volume d'usage, le coût réel restera à **0 FCFA** (quota gratuit).
- Un ordinateur, pour plus de confort (les écrans sont plus lisibles).

---

## Étape 1 — Passer au forfait Blaze

1. [console.firebase.google.com](https://console.firebase.google.com) →
   ouvrez **shaman-bara-center-agence**.
2. En bas à gauche : **⚙️ Modifier le forfait** → **Blaze**.
3. Ajoutez votre carte, validez.

## Étape 2 — Récupérer la clé VAPID

1. **⚙️ Paramètres du projet** → onglet **Cloud Messaging**.
2. Section **Certificats Web Push** → **Générer une paire de clés**.
3. Copiez la clé affichée.
4. Dans `index.html`, remplacez :
   ```
   const VAPID_KEY = "COLLEZ_ICI_VOTRE_CLE_VAPID";
   ```
   par votre clé, entre guillemets.
5. Republiez `index.html` sur GitHub.

## Étape 3 — Vérifier les règles Firestore

**Firestore Database → Règles**, vérifiez que c'est bien :
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
Si c'est déjà le cas (probablement oui, réglé au tout début), rien à faire.

## Étape 4 — Déployer LA fonction (une seule, dans le navigateur)

1. [console.cloud.google.com/functions](https://console.cloud.google.com/functions)
   → sélectionnez bien **shaman-bara-center-agence** en haut de la page.
2. **Créer une fonction** (Create Function).
3. Renseignez :
   - **Environnement** : Cloud Functions (2ᵉ génération)
   - **Nom de la fonction** : `onJournalEntryCreated`
   - **Région** : `us-central1`
   - **Déclencheur** : **Ajouter un déclencheur Eventarc** → Type
     d'événement : `google.cloud.firestore.document.v1.created` →
     Firestore → chemin du document : `journal/{id}`
4. **Enregistrer**, puis **Suivant**.
5. Dans l'éditeur en ligne :
   - **Runtime** : Node.js 20
   - **Point d'entrée** : `onJournalEntryCreated`
   - Fichier `index.js` : collez tout le contenu du fichier
     `functions/index.js` fourni ci-joint.
   - Fichier `package.json` : collez le contenu du fichier
     `functions/package.json` fourni ci-joint.
6. **Déployer**, patientez 2-3 minutes. C'est terminé — une seule fonction
   couvre déjà les candidats, les placements ET les employeurs.

## Étape 5 — Activer sur votre téléphone

Dans l'app → connectez-vous en administrateur → **Outils de gestion →
Notifications** → **🔔 Activer les notifications**. Répétez sur chaque
appareil (vous, vos superviseurs) qui doit recevoir les alertes.

## Étape 6 — Tester

Depuis un autre téléphone (agent), enregistrez une fiche de test. Sur
votre téléphone, verrouillez l'écran ou fermez l'app : la notification
doit arriver dans les secondes qui suivent.

---

### En cas de souci
- Rien ne s'affiche : vérifiez la clé VAPID collée (étape 2) et que la
  fonction est déployée sans erreur (icône verte ✓).
- Pour vérifier que la fonction se déclenche : dans
  console.cloud.google.com/functions → cliquez sur `onJournalEntryCreated`
  → onglet **Journaux** (Logs) → une trace doit apparaître après chaque
  fiche créée par un agent.
- Envoyez-moi une capture d'écran de ce qui bloque, je vous guide pas à pas.
