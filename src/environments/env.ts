import { DevlopmentEnvironment } from "./dev.env";
import { ProductionEnvironment } from "./prod.env";

export interface Environment {
    db_url:string
}

export function getEnvironmentVaribles() {
    if(process.env.NODE_ENV === 'production') {
        return ProductionEnvironment;
    }

    return DevlopmentEnvironment;
}