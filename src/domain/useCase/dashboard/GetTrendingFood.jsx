import { GetTopFood } from "../../../data/Repository/DashboardRepository";

export async function GetTrendingFoodUseCase() {
    return await GetTopFood();
}