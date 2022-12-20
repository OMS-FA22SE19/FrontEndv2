import { GetRoyalCustomersStatistic } from "../../../data/Repository/DashboardRepository";

export async function GetRoyalCustomersUseCase() {
    return await GetRoyalCustomersStatistic();
}