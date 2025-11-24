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