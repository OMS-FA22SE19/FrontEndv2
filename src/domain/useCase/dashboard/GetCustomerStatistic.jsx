import { GetCustomers } from "../../../data/Repository/DashboardRepository";

export async function GetCustomerStatisticUseCase() {
    return await GetCustomers();
}
