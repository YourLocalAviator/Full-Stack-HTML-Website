async function getLessons() {
    try {
        const response = await fetch("http://localhost:3000/lessons", {
            method: "GET",
        });

        if (!response.ok) throw new Error("Failed to fetch lessons");

        const lessons = await response.json();

        return lessons.map(lesson => ({
            ...lesson,
            icon: `http://localhost:3000/images/${lesson.icon}`
        }));
    } catch (err) {
        console.error(err);
        alert("Error fetching lesson data.");
        return [];
    };
};