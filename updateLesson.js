async function updateOrder(lessonID, updateData) {
    try {
        const response = await fetch(`http://localhost:3000/lessons/${lessonID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateData)
        });
        if (!response.ok) throw new Error("Failed to update lesson data to database.");
        return await response.json();
    } catch (err) {
        console.error(err);
        alert("Error updating lesson.");
    };
};