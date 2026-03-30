import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getBookings } from "../../services/apiBookings";
import { PAGE_SIZE } from "../../utils/constants";

export function useBookings() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  //FILTER
  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue, method: "eq" };

  //SORT
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc"; //kiszedjuk url-bol pl.: startDate-desc
  const [field, direction] = sortByRaw.split("-"); // array-ba rakjuk "-" onkent splitelve
  const sortBy = { field, direction }; // objectbe rakjuk

  //PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  //QUERY
  const {
    isLoading,
    data: { data: bookings, count } = {}, // az empty object nelkul hiba lenne
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, page], //a filter be van adva, kb olyan mint egy dependency, ettol is fugg, hogy refetchel e ha ez valtozik
    queryFn: () => getBookings({ filter, sortBy, page }), // ez kuldi az apinak a propokat, amik alapján fetchel!!!
  });

  // PRE_FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);

  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page + 1],
      queryFn: () => getBookings({ filter, sortBy, page: page + 1 }), //defining objects here
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page - 1],
      queryFn: () => getBookings({ filter, sortBy, page: page - 1 }), //defining objects here
    });

  return { isLoading, bookings, error, count };
}
