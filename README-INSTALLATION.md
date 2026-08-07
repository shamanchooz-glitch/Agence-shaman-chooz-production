# Shaman Bara Center — Guide d'installation

Cette application permet à vos assistants d'inscrire des candidat(e)s et
d'enregistrer des placements depuis n'importe quel téléphone, tablette ou
ordinateur, partout dans le monde — et vous, en tant qu'administrateur,
recevez toutes les informations dans votre espace protégé par le code :

**Shaman123chooz**

Pour que toutes les fiches soient partagées entre tous les appareils (et pas
seulement stockées sur un seul téléphone), l'application utilise **Firebase**,
un service gratuit de Google. Voici comment le mettre en place — environ
10 minutes, une seule fois.

## Étape 1 — Créer le projet Firebase (gratuit)

1. Allez sur https://console.firebase.google.com
2. Connectez-vous avec un compte Google (créez-en un si besoin).
3. Cliquez sur **Ajouter un projet**, nommez-le par exemple `shaman-bara-center`.
4. Désactivez Google Analytics si proposé (pas nécessaire), puis **Créer le projet**.

## Étape 2 — Activer la base de données

1. Dans le menu de gauche, sous **Build**, cliquez sur **Firestore Database**
   (⚠️ pas *Realtime Database*, qui est un produit différent avec des règles
   différentes — c'est la confusion la plus fréquente).
2. Cliquez sur **Créer une base de données**.
3. Choisissez l'emplacement le plus proche de vous.
4. Sélectionnez **Mode production**, puis **Activer**.
5. Une fois sur la page **Firestore Database**, allez dans l'onglet
   **Règles** (en haut) et remplacez tout le contenu par :

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

   Cliquez sur **Publier**. Ces règles n'autorisent l'accès qu'aux appareils
   connectés avec une identité Firebase (voir étape suivante) — personne
   d'autre ne peut lire ou modifier vos fiches, même en devinant l'adresse
   de l'application.

## Étape 3 — Activer l'authentification (sécurité)

L'application connecte automatiquement chaque téléphone avec une identité
Firebase **anonyme et invisible** (pas de mot de passe à retenir pour vos
assistants) — cela suffit à satisfaire la règle `request.auth != null`
ci-dessus. Il faut simplement l'activer une fois :

1. Dans le menu de gauche, sous **Build**, cliquez sur **Authentication**.
2. Cliquez sur **Get started** (ou **Commencer**).
3. Dans l'onglet **Sign-in method**, cliquez sur **Anonyme** (Anonymous) puis
   **Activer**, puis **Enregistrer**.

C'est tout : dès qu'un téléphone ouvre l'application, il reçoit
automatiquement cette identité anonyme en arrière-plan.

## Étape 4 — Récupérer la configuration

1. Dans le menu de gauche, cliquez sur l'icône ⚙️ (Paramètres du projet).
2. Descendez jusqu'à **Vos applications**, cliquez sur l'icône Web `</>`.
3. Donnez un surnom (ex: `shaman-web`), puis **Enregistrer l'application**.
4. Copiez l'objet `firebaseConfig` qui s'affiche, il ressemble à ceci :

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "shaman-bara-center.firebaseapp.com",
  projectId: "shaman-bara-center",
  storageBucket: "shaman-bara-center.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcd1234"
};
```

## Étape 5 — Coller la configuration dans l'application

1. Ouvrez le fichier `index.html`.
2. Cherchez la section `CONFIGURATION FIREBASE` (tout en haut du `<script>`).
3. Remplacez les valeurs `"REMPLACE_MOI"` par celles copiées à l'étape 3.
4. Enregistrez le fichier.

## Étape 6 — Publier l'application sur GitHub Pages

Comme vous hébergez déjà vos projets sur GitHub :

1. Créez un nouveau dépôt (ex: `shaman-bara-center-app`).
2. Ajoutez-y les fichiers : `index.html`, `manifest.json`, `sw.js`,
   `icon-192.png`, `icon-512.png`, `avatar.jpg`, `profile-full.jpg`,
   `qrcode.js`.
3. Allez dans **Settings → Pages**, choisissez la branche `main` et le
   dossier `/ (root)`, puis **Save**.
4. Après 1 à 2 minutes, votre application sera disponible à une adresse du
   type : `https://votre-nom-utilisateur.github.io/shaman-bara-center-app/`

## Étape 7 — Installer l'application sur les téléphones

Partagez ce lien à vous-même et à vos assistants. Sur chaque téléphone :

- **Android (Chrome)** : ouvrir le lien → menu ⋮ → *Installer l'application*
  (ou *Ajouter à l'écran d'accueil*).
- **iPhone (Safari)** : ouvrir le lien → bouton Partager (carré avec flèche)
  → *Sur l'écran d'accueil*.
- **Ordinateur (Chrome/Edge)** : une icône d'installation ⊕ apparaît dans la
  barre d'adresse.

Une fois installée, l'application s'ouvre comme une vraie application, avec
son icône, même sans passer par le navigateur — et fonctionne dans le monde
entier tant que l'appareil a accès à internet (les fiches déjà consultées
restent lisibles brièvement hors connexion).

## Lien direct et QR Code

Sur l'écran d'accueil (et aussi dans l'espace agent et l'espace administrateur),
un bouton **« Ouvrir sur un autre appareil » / « Partager l'application »**
affiche un QR code et le lien exact de votre application, générés
automatiquement à partir de l'adresse où elle est installée. Il suffit qu'un
assistant scanne ce code avec l'appareil photo de son téléphone pour ouvrir
l'application, ou de partager le lien copié par le bouton **Copier le lien**.

## Fonctionnement hors ligne

L'application continue de fonctionner **même sans Wi-Fi ni données mobiles** :
- Elle s'ouvre normalement (l'app elle-même est enregistrée sur l'appareil).
- Les agents peuvent inscrire des candidat(e)s et enregistrer des placements
  hors connexion ; chaque fiche est gardée en mémoire sur le téléphone.
- Dès que le réseau revient, toutes les fiches en attente sont envoyées et
  synchronisées automatiquement avec tous les autres appareils — sans action
  à faire.
- Un bandeau en haut de l'écran rappelle qu'on est hors connexion. Par défaut,
  l'app recommande de se reconnecter dans les **7 jours** suivant la dernière
  connexion (pour éviter d'accumuler trop de fiches non synchronisées sur un
  seul téléphone) ; au-delà, l'app continue de fonctionner mais le bandeau
  devient un avertissement. Pour changer ce délai, recherchez
  `OFFLINE_MAX_DAYS` dans `index.html` et remplacez `7` par le nombre de jours
  souhaité.

## Comment ça fonctionne au quotidien

- **Vos assistants** ouvrent l'app → *Espace Agent* → ils inscrivent un(e)
  candidat(e) (avec photo prise directement depuis le téléphone) ou
  enregistrent un placement. Aucun code n'est nécessaire pour eux.
- **Vous** ouvrez l'app → *Espace Administrateur* → tapez le code
  `Shaman123chooz` → vous voyez toutes les fiches, tous les placements, les
  statistiques, et pouvez tout exporter en fichier CSV (Excel).
- Toutes les données sont partagées en temps réel entre tous les appareils :
  ce qu'un assistant enregistre à Abidjan apparaît immédiatement dans votre
  espace administrateur, où que vous soyez dans le monde.

## Sécurité du code administrateur

Le code `Shaman123chooz` est actuellement écrit dans le fichier `index.html`
(recherchez `ADMIN_CODE`). Si vous voulez le changer, modifiez cette ligne et
republiez le fichier sur GitHub. Pour une sécurité renforcée (empêcher que
quelqu'un lise le code dans le fichier), on peut ajouter une vraie
authentification Firebase — dites-le-moi si vous le souhaitez.

## Les 11 outils de gestion (espace administrateur → « Outils de gestion »)

1. **Identification de l'agent** — chaque agent indique son nom une fois ; il est ensuite associé à tout ce qu'il enregistre.
2. **Journal d'activité** — historique complet et horodaté de toutes les actions.
3. **Tableau de bord graphique** — évolution mensuelle des inscriptions et des placements.
4. **Alertes candidats non placés** — candidat(e)s disponibles depuis plus de 30 jours.
5. **Rappels de fin de contrat** — placements arrivant à échéance sous 7 jours.
6. **Recherche avancée** — filtres par niveau d'étude et statut, en plus de la recherche texte.
7. **Notes internes** — fil de suivi horodaté sur chaque fiche candidat.
8. **Suivi financier** — pourcentage de commission par placement et total des commissions.
9. **Évaluation des candidats** — note en étoiles après chaque placement.
10. **Reçu de placement imprimable** — bouton « Imprimer / enregistrer en PDF » sur chaque fiche de suivi.
11. **Sauvegarde complète** — export de toutes les données en JSON et en CSV.

Ces outils ne nécessitent aucune configuration supplémentaire : ils utilisent la
même base Firebase déjà en place.

## Besoin d'aide ?

Si une étape bloque, envoyez-moi une capture d'écran de ce que vous voyez et
je vous guide.

### Erreur déjà rencontrée : « Erreur lors de l'enregistrement des règles »

Si ce message apparaît, vérifiez que vous êtes bien sur la page
**Firestore Database → Règles**, et pas sur **Realtime Database → Règles**
(visible dans le menu de gauche) : ce sont deux produits Firebase distincts,
avec une syntaxe de règles différente — coller des règles Firestore dans
Realtime Database (ou l'inverse) provoque exactement cette erreur.
