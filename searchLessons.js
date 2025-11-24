async function searchLessons(query) {
    try {
        const response = await fetch(`http://localhost:3000/search?query=${encodeURIComponent(query)}`, {
            method: "GET",
        });
         if (!response.ok) throw new Error("Failed to search lessons");

        const lessons = await response.json();

        return lessons.map(lesson => ({
            ...lesson,
            icon: `http://localhost:3000/images/${lesson.icon}`
        }));
    } catch (err) {
        console.error(err);
        alert("Error searching lessons.");
        return [];
    };
};