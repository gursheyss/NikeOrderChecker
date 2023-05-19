const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const orderCheckModule = require('../../orderCheck.js');

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
                .setRequired(true)),
    async execute(interaction) {
        const orderNumber = interaction.options.getString('order_number');
        const email = interaction.options.getString('email');

        try {
            const orderData = await orderCheckModule.orderCheck(orderNumber, email);
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: "Nike Order Checker",
                })
                .setTitle(`${orderData.productInfo.title} - ${orderData.productInfo.color}`)
                .addFields(
                    {
                        name: "SKU",
                        value: `${orderData.productInfo.styleColor}`,
                        inline: true
                    },
                    {
                        name: "Size",
                        value: `${orderData.productInfo.size}`,
                        inline: true
                    },
                    {
                        name: "Price",
                        value: `$${orderData.totalPrice.toFixed(2)}`,
                        inline: true
                    },
                    {
                        name: "Status",
                        value: `${orderData.orderStatus.charAt(0).toUpperCase() + orderData.orderStatus.slice(1)}`,
                        inline: true
                    },
                    {
                        name: "Last 4 of Card",
                        value: `${orderData.lastFour}`,
                        inline: true
                    },
                    {
                        name: "Purchase Date",
                        value: `${orderData.orderPurchaseDate.substring(orderData.orderPurchaseDate.indexOf(" - ") + 3)}`,
                        inline: true
                    },
                    {
                        name: "Returnable?",
                        value: orderData.returnable === true ? "Yes" : "No",
                        inline: true
                    },
                    {
                        name: "Tracking Link",
                        value: `[Link](${orderData.trackingLink})`,
                        inline: true
                    },
                    {
                        name: "Address",
                        value: `${orderData.addressInfo.address1}\n${orderData.addressInfo.address2}\n${orderData.addressInfo.city}, ${orderData.addressInfo.state}\n${orderData.addressInfo.zipCode}`,
                        inline: true
                    },
                    {
                        name: "Name",
                        value: `${orderData.recipientInfo.firstName} ${orderData.recipientInfo.lastName}`,
                        inline: true
                    },
                    {
                        name: "Phone Number",
                        value: `${orderData.contactInfo.dayPhoneNumber}`,
                        inline: true
                    },
                    {
                        name: "Email",
                        value: `${orderData.contactInfo.email}`,
                        inline: true
                    },
                )
                .setThumbnail(`${orderData.productInfo.productImage}`)
                .setColor("#fabc72")
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error checking order:', error);
            await interaction.reply('An error occurred while checking the order.');
        }
    }
};
