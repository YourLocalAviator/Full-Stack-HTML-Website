/* Async Function that retrieves lesson data from the back end.
1. Fetches the data from the Render Back End through an async / await function via. GET Method
2a. If there is no response, an error is sent
2b. If there is lesson data, it is sent as JSON data through const lessons
3. It will also loop through each object through .map to return the lesson icon from the back end for the lessons
4. TRY-CATCH Method ensures that the function continues working even if an error occurs
*/
async function getLessons() {
    try {
        const response = await fetch("https://cst-3144-cw-full-stack-back-end-code.onrender.com/lessons", {
            method: "GET",
        });

        if (!response.ok) throw new Error("Failed to fetch lessons");

        const lessons = await response.json();

        return lessons.map(lesson => ({
            ...lesson,
            icon: `https://cst-3144-cw-full-stack-back-end-code.onrender.com/images/${lesson.icon}`
        }));
    } catch (err) {
        console.error(err);
        alert("Error fetching lesson data.");
        return [];
    };
};