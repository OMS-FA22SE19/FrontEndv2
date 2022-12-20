import { GetOrdersReservations } from "../../../data/Repository/DashboardRepository";

export async function GetMonthlyOrdersReservationsUseCase() {
    return await GetOrdersReservations();
}