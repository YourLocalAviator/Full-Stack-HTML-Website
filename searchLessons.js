/* Async Function that retrieves lesson data from the back end based on the search query.
1. Query parameter data is retrieved from the front end through user input
2a. Data is then fetched from the back end through an async / await function via. GET Method
2b. If there is no response, an error is sent
2c. If there is lesson data based on the query, it is sent as JSON data through const lessons
3. It will also loop through each object through .map to return the lesson icon from the back end for the lessons
4. TRY-CATCH Method ensures that the function continues working even if an error occurs
*/
async function searchLessons(query) {
    try {
        const response = await fetch(`https://cst-3144-cw-full-stack-back-end-code.onrender.com/search?query=${encodeURIComponent(query)}`, {
            method: "GET",
        });
         if (!response.ok) throw new Error("Failed to search lessons");

        const lessons = await response.json();

        return lessons.map(lesson => ({
            ...lesson,
            icon: `https://cst-3144-cw-full-stack-back-end-code.onrender.com/images/${lesson.icon}`
        }));
    } catch (err) {
        console.error(err);
        alert("Error searching lessons.");
        return [];
    };
};