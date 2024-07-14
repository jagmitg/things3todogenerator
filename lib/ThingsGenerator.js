const { format, differenceInDays } = require("date-fns");

class ThingsGenerator {
    constructor(projectTitle, sections, startDate, endDate) {
        this.projectTitle = projectTitle;
        this.sections = sections;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    generate() {
        let duration = 0;
        if (this.startDate && this.endDate) {
            duration = differenceInDays(new Date(this.endDate), new Date(this.startDate)) + 1;
        }

        const items = this.sections.map((section) => ({
            type: "heading",
            attributes: {
                title: section.heading
            },
            items: section.content.map((item) => ({
                type: "to-do",
                attributes: {
                    title: duration && item.includes("days") ? `${item} for ${duration} days` : item
                }
            }))
        }));

        const project = {
            type: "project",
            attributes: {
                title: `✈️ ${this.projectTitle}`,
                creation_date: this.startDate
                    ? format(new Date(this.startDate), "yyyy-MM-dd'T'HH:mm:ss'Z'")
                    : undefined,
                completion_date: this.endDate
                    ? format(new Date(this.endDate), "yyyy-MM-dd'T'HH:mm:ss'Z'")
                    : undefined,
                items: items.flatMap((section) => [
                    { type: "heading", attributes: { title: section.attributes.title } },
                    ...section.items
                ])
            }
        };

        const jsonString = JSON.stringify([project]);
        const encodedJsonString = encodeURIComponent(jsonString);

        return `things:///json?data=${encodedJsonString}`;
    }
}

module.exports = ThingsGenerator;
