const mergeJsonData = (baseData = [], newData = []) => {
    console.log("Starting merge process...");
    console.log("Base Data:", JSON.stringify(baseData, null, 2));
    console.log("New Data:", JSON.stringify(newData, null, 2));

    newData.forEach((newSection) => {
        const existingSection = baseData.find((section) => section.heading === newSection.heading);

        if (existingSection) {
            existingSection.content = [...new Set([...existingSection.content, ...newSection.content])];
            console.log(`Merged section: ${newSection.heading}`);
        } else {
            baseData.push({ ...newSection });
            console.log(`Added new section: ${newSection.heading}`);
        }
    });

    console.log("Merged Data:", JSON.stringify(baseData, null, 2));
    return baseData;
};

module.exports = { mergeJsonData };
