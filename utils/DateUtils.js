export const formatDateCZ = (timestamp) => {

    if (timestamp && timestamp.seconds !== undefined) {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString('cs-CZ');
    } else {
        return null;
    }

};

export const formatDate = (timestamp) => {

    if (timestamp && timestamp.seconds !== undefined) {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString('en-US');
    } else {
        return null;
    }

};