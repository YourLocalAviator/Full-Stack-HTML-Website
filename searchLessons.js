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