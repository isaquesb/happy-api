import Orphanage from "../models/Orphanage";
import ImageView from './images_view';

export default {
    render(row: Orphanage) {
        return {
            id: row.id,
            name: row.name,
            latitude: row.latitude,
            longitude: row.longitude,
            about: row.about,
            instructions: row.instructions,
            opening_hours: row.opening_hours,
            open_on_weekends: row.open_on_weekends,
            images: ImageView.renderMany(row.images),
        }
    },
    renderMany(rows: Orphanage[]) {
        return rows.map((row) => this.render(row));
    }
}
