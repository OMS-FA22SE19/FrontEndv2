import { GetFoods } from "../../../data/Repository/DashboardRepository";

export async function GetFoodStatisticUseCase() {
    return await GetFoods();
}