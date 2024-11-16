# Bot d'absences

## Installation

> :warning: Vous devez créer une application avec un bot sur https://discord.com/developers pour pouvoir configurer et utiliser ce bot. Dans la rubrique "Installation", vous devez activer les contextes "User" et "Guild" puis le scope "application.commands" pour les deux contextes ainsi que le scope "bot" pour le contexte "Guild" avec la permission "Send Messages".

### Récupérer le code 

```bash
git clone git@github.com:RandyVV/planning-discord-bot.git
```

### Installer les dépendances

```bash
npm install
```

### Configurer le bot

```bash
cp .env.example .env
```

Puis renseigner les valeurs suivantes dans le fichier `.env` :
- `DISCORD_TOKEN` : token de votre bot (disponible sur la page de configuration de votre bot)
- `CLIENT_ID` : identifiant de votre application (disponible sur la page de configuration de votre application Discord)
- `STAFF_CHANNEL_ID` : identifiant du canal dans lequel vous souhaitez que le staff reçoive les notifications d'absences (disponible sur votre serveur Discord si vous avez activé le mode développeur)

### Enregistrer les commandes

```bash
npm run register-commands
```

## Démarrer le bot

### En mode développement

```bash
npm run dev
```

### En production

```bash
npm start
```

## Utiliser le bot

Dans le canal dans lequel vous souhaitez faire figurer le widget de déclaration d'absences pour vos utilisateurs, utilisez la commande :

```
/absences
```