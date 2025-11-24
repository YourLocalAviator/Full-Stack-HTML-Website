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