/* Async function that updates lesson data to the back end.
1. Calls the back end through an async / await function via. the lesson ID provided
2a. Headers is set as JSON to ensure that the data is sent correctly
2b. If the back end is called successfully, the body of that PUT Method will 
contain the updateData from the front end 
3. If the data is sent, it waits for the response from the back end
4. TRY-CATCH Method ensures that the function continues working even if an error occurs*/
async function updateLesson(lessonID, updateData) {
    try {
        const response = await fetch(`https://cst-3144-cw-full-stack-back-end-code.onrender.com/lessons/${lessonID}`, {
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