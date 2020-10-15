import Image from "../models/Image";

export default {
    render(row: Image) {
        return {
            id: row.id,
            url: `${process.env.APP_URL}/uploads/${row.path}`
        }
    },
    renderMany(rows: Image[]) {
        return rows.map((row) => this.render(row));
    }
}
