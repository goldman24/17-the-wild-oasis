import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateCurrentUser } from "../../services/apiAuth";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: (user, { password }) => {
      toast.success(
        password
          ? "Password successfully updated"
          : "User account successfully updated",
      );
      // queryClient.setQueryData(["user"], user); //kézzel azonnal az új adat a cache-be - gyors
      queryClient.invalidateQueries({ queryKey: ["user"] }); // stale-nak jeloljuk a query-t és ujra letoltjuk - biztosabb, mert szerverrol kerjuk
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, updateUser };
}
