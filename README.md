# AGN 2026
Jeu de collecte solidaire en français, hors ligne. Attraper les colis (+10 points), éviter les obstacles (-1 vie). Une partie dure 60 secondes, avec trois vies. Contrôle tactile ou flèches, pause, reprise et record local.

## Android
- Nom : AGN 2026
- Application ID : `agn.y2026.organization.com`
- Version : 1.0 (1)
- Minimum : Android 6 / API 23
- Cible : API 36
- Aucun compte, serveur, permission Internet, publicité, achat ou don réel.

L'identifiant demandé `agn.2026.organization.com` est invalide : chaque segment doit commencer par une lettre. `y2026` conserve l'année avec une syntaxe valide.

## Construire
Ouvrir dans Android Studio, ou utiliser JDK 17, Gradle 8.11.1 et Android SDK 36 :

```
gradle :app:assembleDebug :app:bundleRelease :app:lintRelease
```

Le workflow GitHub Actions construit un APK de test et un AAB release. Sans clé, l'AAB est **non signé** : il n'est pas prêt à téléverser dans Google Play.

Pour signer, fournir les secrets du repository : `AGN_KEYSTORE_BASE64`, `AGN_STORE_PASSWORD`, `AGN_KEY_ALIAS`, `AGN_KEY_PASSWORD`. La clé doit être conservée hors du dépôt et sauvegardée durablement par son propriétaire. Ne jamais publier la clé ou son mot de passe dans le code.

Une fois la construction terminée, télécharger l'artifact `AGN-2026-android` dans Actions. Aucune publication Play Store n'est automatique.

## Vérification effectuée
Syntaxe JavaScript, scénarios de collecte, collision, fin de partie, pause/reprise et persistance du record vérifiés localement. La compilation Android et le test sur appareil restent à effectuer : le SDK et Gradle ne sont pas disponibles dans l'environnement de préparation.

## Confidentialité
Les seules données conservées sont le meilleur score sur l'appareil. Le jeu ne collecte ni ne transmet de données personnelles. Aucun événement réel de l'association n'est inventé. Les points sont purement ludiques.
