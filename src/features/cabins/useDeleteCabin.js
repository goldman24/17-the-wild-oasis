import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCabin as deleteCabinApi } from "../../services/apiCabins";

export function useDeleteCabin() {
  const queryClient = useQueryClient(); //ki kell szedni ezt, hogy invalidate queries tudja

  //{} - destructuring - saving the results of useMutation
  const { isLoading: isDeleting, mutate: deleteCabin } = useMutation({
    mutationFn: deleteCabinApi,
    onSuccess: () => {
      toast.success("Cabin successfully deleted");

      queryClient.invalidateQueries({ queryKey: ["cabins"] }); //invalidating the cache for the "cabin" query, so that it will be refetched and updated with the latest data after a cabin is deleted
    }, //invalidateQueries, hogy törlés után ujra rendereljen -kell bele a query key is,hogy tudja melyiket kell invalidalni

    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteCabin };
}
