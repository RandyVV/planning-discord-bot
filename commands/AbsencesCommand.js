import {
	SlashCommandBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder
} from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('absences')
		.setDescription('Configure le canal pour déclarer les absences'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Combien de temps allez-vous vous absenter ?');

		// Créer les boutons de choix
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('1_week')
					.setLabel('1 semaine')
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId('1_5_weeks')
					.setLabel('1 semaine et demie')
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId('2_weeks')
					.setLabel('2 semaines')
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId('more_than_2_weeks')
					.setLabel('+ de 2 semaines')
					.setStyle(ButtonStyle.Danger)
			);

		await interaction.reply({ embeds: [embed], components: [row] });
	},
};