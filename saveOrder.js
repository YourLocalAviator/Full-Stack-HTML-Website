/* Async Function that saves new order data to the back end.
1. Calls the back end through an async / await function
2a. Headers is set as JSON to ensure that the data is sent correctly
2b. If the back end is called successfully, the body of that POST Method will 
contain the orderData from the front end
2c. If there is no response from the back end, an error is sent
3. If the data is sent, it waits for the response from the back end
4. TRY-CATCH Method ensures that the function continues working even if an error occurs
*/
async function saveOrder(orderData) {
    try {
        const response = await fetch ("https://cst-3144-cw-full-stack-back-end-code.onrender.com/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        });
        if (!response.ok) throw new Error("Failed to save order to database.");
        return await response.json();
    } catch (err) {
        console.error(err);
        alert("Error saving order.");
    };
};