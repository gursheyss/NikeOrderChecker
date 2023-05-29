const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const orderCheckModule = require('../../orderCheck.js');
const interactionType = process.env.INTERACTION;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check')
        .setDescription('Checks Nike order')
        .addStringOption(option =>
            option.setName('order_number')
                .setDescription('Order number of the order you would like to check')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('email')
                .setDescription('Email of the order you would like to check')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('time_zone')
                .setDescription('Your Time Zone')
                .addChoices(
                    {name: 'PST', value: 'pst'},
                    {name: 'MST', value: 'mst'},
                    {name: 'CST', value: 'cst'},
                    {name: 'EST', value: 'est'},
                )
                .setRequired(true)),
    async execute(interaction) {
        const orderNumber = interaction.options.getString('order_number');
        const email = interaction.options.getString('email');
        const timeZone = interaction.options.getString('time_zone')

        try {
            const orderData = await orderCheckModule.orderCheck(orderNumber, email, timeZone);
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: "Nike Order Checker",
                })
                .setTitle(`${orderData.productInfo.title} - ${orderData.productInfo.color}`)
                .setThumbnail(`${orderData.productInfo.productImage}`)
                .setColor("#fabc72")
                .addFields(
                    {
                        name: "Product Info",
                        value:
                            `SKU: \`${orderData.productInfo.styleColor}\`
                            Size: \`${orderData.productInfo.size}\`
                            Price: \`$${orderData.totalPrice.toFixed(2)}\`
                            Returnable?: \`${orderData.returnable === true ? "Yes" : "No"}\``,
                        inline: false
                    },
                    {
                        name: "Order Info",
                        value:
                            `Status: \`${orderData.orderStatus.charAt(0).toUpperCase() + orderData.orderStatus.slice(1)}\`
                            Last 4 of Card: \`${orderData.lastFour}\`
                            Purchase Date: \`${orderData.orderPurchaseDate.substring(orderData.orderPurchaseDate.indexOf(" - ") + 3)}\`
                            Tracking Link: [Link](${orderData.trackingLink !== '' ? orderData.trackingLink : 'Not available'})`,
                        inline: false
                    },
                    {
                        name: "Recipient Info",
                        value:
                            `Name: \`${orderData.recipientInfo.firstName} ${orderData.recipientInfo.lastName}\`
                            Address: \`${orderData.addressInfo.address1}\`
                            \`${orderData.addressInfo.address2 !== '' ? orderData.addressInfo.address2 : ''}\`
                            \`${orderData.addressInfo.city}, ${orderData.addressInfo.state}\`
                            \`${orderData.addressInfo.zipCode}\`
                            Phone Number: \`${orderData.contactInfo.dayPhoneNumber}\`
                            Email: \`${orderData.contactInfo.email}\``,
                        inline: false
                    }
                )
                .setTimestamp();

            if (interactionType == 'channel') {
                await interaction.reply({ embeds: [embed], ephemeral: true });
                await interaction.followUp(`Successfully fetched order data for ${interaction.user}`)
                console.log(`Successfully used command in ${interaction.channelId}`)
            }
            else if (interactionType == 'dm') {
                interaction.user.send({ embeds: [embed] })
                await interaction.reply({ content: `Sent order info in DM's!`, ephemeral: true });
                await interaction.followUp(`Successfully DM\'d order data to ${interaction.user}`)
                console.log(`Successfully sent dm to ${interaction.user}`)
            }
            else {
                console.log('Invalid interaction type! Must be dm or channel. Check your .env')
                await interaction.reply('Invalid interaction type! Must be dm or channel. Check your .env')
            }
        } catch (error) {
            await interaction.reply(`An error occurred while checking the order.\n${error}`);
        }
    }
};
