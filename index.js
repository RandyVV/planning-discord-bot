import 'dotenv/config';
import {
    Client,
    GatewayIntentBits,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    Events,
    Partials,
    Collection
} from 'discord.js';

import commands from './commands/index.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel] // Nécessaire pour les messages privés
});

const channels = {
    member: '',
    staff: ''
};

const STAFF_CHANNEL_ID = process.env.STAFF_CHANNEL_ID;

client.commands = new Collection();
for (const command of commands) {
    client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "Une erreur est survenue lors de l'exécution de la commande.",
            ephemeral: true
        });
    }
});

// Gestion des clics de bouton
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;

    const user = interaction.user;
    const selectedOption = interaction.customId;

    // Comportement des trois premiers boutons (1 semaine, 1 semaine et demie, 2 semaines)
    if (['1_week', '1_5_weeks', '2_weeks'].includes(selectedOption)) {
        await interaction.reply({ content: 'Souhaitez-vous que votre absence commence à partir d\'aujourd\'hui ?', ephemeral: true });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`start_today-${selectedOption}`)
                    .setLabel('OUI')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`start_later-${selectedOption}`)
                    .setLabel('NON')
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.followUp({ content: 'Veuillez choisir une option.', components: [row], ephemeral: true });
    }

    // Comportement du bouton "+ de 2 semaines"
    else if (selectedOption === 'more_than_2_weeks') {
        const staffChannel = await client.channels.fetch(STAFF_CHANNEL_ID);
        await staffChannel.send(`<@${user.id}> a signalé une absence de plus de 2 semaines. Merci de le contacter pour plus de détails.`);
        await interaction.reply({ content: 'Votre absence prolongée a bien été signalée au staff.', ephemeral: true });
    }

    // Gestion des choix "OUI" ou "NON" pour le début de l'absence
    else if (selectedOption.startsWith('start_today-') || selectedOption.startsWith('start_later-')) {
        const absencePeriod = selectedOption.split('-')[1]; // Récupère la période : '1_week', '1_5_weeks', '2_weeks'

        if (selectedOption.startsWith('start_today-')) {
            // Calcul de la date de fin
            const endDate = new Date();
            switch (absencePeriod) {
                case '1_week':
                    endDate.setDate(endDate.getDate() + 7);
                    break;
                case '1_5_weeks':
                    endDate.setDate(endDate.getDate() + 10);
                    break;
                case '2_weeks':
                    endDate.setDate(endDate.getDate() + 14);
                    break;
                default:
                    break;
            }

            const staffChannel = await client.channels.fetch(STAFF_CHANNEL_ID);
            await staffChannel.send(`<@${user.id}> sera absent jusqu’au ${endDate.toLocaleDateString('fr-FR')}.`);
            await interaction.reply({ content: 'Votre absence a été prise en compte et transmise au staff.', ephemeral: true });
        } else {
            // Envoi de la demande de date de début en message privé
            await user.send('Veuillez indiquer la date de début de votre absence au format JJ/MM/AAAA (par exemple : 01/01/2024 pour le 1er janvier 2024) :');

            // Attendre la réponse de l'utilisateur avec une date
            const filter = response => response.author.id === user.id;
            try {
                const collected = await user.dmChannel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
                const startDate = new Date(collected.first().content.split('/').reverse().join('-'));

                if (isNaN(startDate)) throw new Error('Invalid date format');

                // Calcul de la date de fin
                const endDate = new Date();
                switch (absencePeriod) {
                    case '1_week':
                        endDate.setDate(endDate.getDate() + 7);
                        break;
                    case '1_5_weeks':
                        endDate.setDate(endDate.getDate() + 10);
                        break;
                    case '2_weeks':
                        endDate.setDate(endDate.getDate() + 14);
                        break;
                    default:
                        break;
                }

                const staffChannel = await client.channels.fetch(STAFF_CHANNEL_ID);
                await staffChannel.send(`<@${user.id}> sera absent du ${startDate.toLocaleDateString('fr-FR')} au ${endDate.toLocaleDateString('fr-FR')}.`);
                await user.send('Votre absence a bien été prise en compte et transmise au staff.');
            } catch (error) {
                await user.send('Format de date invalide. Veuillez saisir la date au format JJ/MM/AAAA (par exemple : 01/01/2024 pour le 1er janvier 2024).');
            }
        }
    }
});

// Connexion du bot avec votre token
client.login(process.env.DISCORD_TOKEN);
