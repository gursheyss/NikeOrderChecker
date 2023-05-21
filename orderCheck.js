module.exports = {
    orderCheck: async function orderCheck(orderNumber, email, timeZone) {
        const options = {
            method: 'GET',
            headers: {
                'nike-api-caller-id': 'com.nike:sse.orders'
            }
        };

        if (timeZone === 'pst') {timeZone = "Los_Angeles"}
        if (timeZone === 'mst') {timeZone = "Denver"}
        if (timeZone === 'cst') {timeZone = "Chicago"}
        if (timeZone === 'est') {timeZone = "New_York"}

        try {
            const response = await fetch(`https://api.nike.com/orders/summary/v1/${orderNumber}?locale=en_us&country=US&language=en&email=${email}&timezone=America%2F${timeZone}`, options);
            const data = await response.json();

            const orderData = { //breaks down req response
                orderId: data.orderId,
                orderPurchaseDate: data.fullOrderStatus.subStatus,
                lastFour: data.payment[0].paymentDisplayNumber,
                totalPrice: data.transaction.orderTotal,
                productInfo: data.group[0].orderItems[0].product,
                orderStatus: data.group[0].orderItems[0].lineItemStatus.status,
                returnable: data.group[0].orderItems[0].returnableFlag,
                trackingLink: data.group[0].actions.trackShipment.webLink,
                addressInfo: data.shipFrom.address,
                recipientInfo: data.shipFrom.recipient,
                contactInfo: data.shipFrom.contactInformation
            };

            return orderData;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
};