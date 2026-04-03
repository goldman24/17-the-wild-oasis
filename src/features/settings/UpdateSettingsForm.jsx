import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import { useSettings } from "./useSettings";
import { useUpdateSetting } from "./useUpdateSetting";

function UpdateSettingsForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    isLoading,
    settings: {
      minBookingLength,
      maxBookingLength,
      maxGuestsPerBooking,
      breakfastPrice,
    } = {}, // ezzel a {}-el nem lesz undefined a data - fallback object
  } = useSettings();

  const { isUpdating, updateSetting } = useUpdateSetting();

  if (isLoading) return <Spinner />;

  function onSubmit(data) {
    updateSetting(data);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        label="Minimum nights/booking"
        error={errors?.minBookingLength?.message}
      >
        <Input
          type="number"
          id="min-nights"
          disabled={isUpdating}
          defaultValue={minBookingLength}
          {...register("minBookingLength", {
            required: "This field is required",
            valueAsNumber: true,
          })}
        />
      </FormRow>

      <FormRow
        label="Maximum nights/booking"
        error={errors?.maxBookingLength?.message}
      >
        <Input
          type="number"
          id="max-nights"
          disabled={isUpdating}
          defaultValue={maxBookingLength}
          {...register("maxBookingLength", {
            required: "This field is required",
            valueAsNumber: true,
          })}
        />
      </FormRow>

      <FormRow
        label="Maximum guests/booking"
        error={errors?.maxGuestsPerBooking?.message}
      >
        <Input
          type="number"
          id="max-guests"
          disabled={isUpdating}
          defaultValue={maxGuestsPerBooking}
          {...register("maxGuestsPerBooking", {
            required: "This field is required",
            valueAsNumber: true,
          })}
        />
      </FormRow>

      <FormRow label="Breakfast price" error={errors?.breakfastPrice?.message}>
        <Input
          type="number"
          id="breakfast-price"
          disabled={isUpdating}
          defaultValue={breakfastPrice}
          {...register("breakfastPrice", {
            required: "This field is required",
            valueAsNumber: true,
          })}
        />
      </FormRow>
      <Button style={{ marginTop: "2.4rem" }} disabled={isUpdating}>
        Submit
      </Button>
    </Form>
  );
}

export default UpdateSettingsForm;
