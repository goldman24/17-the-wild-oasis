import { useForm } from "react-hook-form";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

import { useCreateCabin } from "./useCreateCabin";
import { useUpdateCabin } from "./useUpdateCabin";

function CreateCabinForm({ cabinToEdit, onCloseModal }) {
  const { isCreating, createCabin } = useCreateCabin();
  const { isUpdating, updateCabin } = useUpdateCabin();
  const isWorking = isCreating || isUpdating; //ha bármelyik true, akkor true lesz, és ez alapján tudjuk disablolni a gombot, hogy ne lehessen egyszerre létrehozni és szerkeszteni

  const { id: editId, ...editValues } = cabinToEdit || {}; //ha nincs cabinToEdit, akkor üres objektumot destructuringolunk, így editId és editValues undefined lesz, de nem lesz error
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState; // formState a useForm-bol jön, és ebben van egy errors nevű objektum (amit is destructuring kiveszünk), amiben a mezők nevei kulcsként szerepelnek, és értékük egy objektum, ami tartalmazza a hibaüzenetet (message) és egyéb információkat a hibáról. Ha nincs hiba, akkor az adott mező neve nem lesz jelen az errors objektumban.

  //data itt a data, a fildeknek, amik registerelve vannak
  function onSubmit(data) {
    const image = typeof data.image === "string" ? data.image : data.image[0]; //ha edit sessionben vagyunk, akkor a data.image már egy string lesz (a kép url-je), ha pedig create sessionben vagyunk, akkor a data.image egy FileList lesz, amiből ki kell szedni az első elemet (a feltöltött fájlt)

    if (isEditSession)
      updateCabin(
        { newCabinData: { ...data, image }, id: editId },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        },
      );
    else
      createCabin(
        { ...data, image: image },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        },
      );
  }

  function onError(errors) {
    // console.log(errors);
  }

  return (
    //onError akkor lesz hivva onSubmit HELYETT, ha validation nem sikerul egyik mezoben -> required
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"} //ha modal nyitva van (onCloseModal=true), akkor modal erteket ad a propnak, és a stylingot ez alapján lehet modositani
    >
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", { required: "Cabin name is required" })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("maxCapacity", {
            required: "Maximum capacity is required",
            min: { value: 1, message: "Capacity must be at least 1" },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register("regularPrice", {
            required: "Regular price is required",
            min: { value: 100, message: "Price must be at least 100" },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
          defaultValue={0}
          {...register("discount", {
            required: "Discount is required",
            validate: (value) =>
              value <= Number(getValues().regularPrice) ||
              "Discount should be less than regular price",
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea
          type="number"
          id="description"
          disabled={isWorking}
          defaultValue=""
          {...register("description", { required: "Description is required" })}
        />
      </FormRow>

      <FormRow label="Cabin photo" error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          disabled={isWorking}
          {...register("image", {
            required: isEditSession ? false : "Cabin photo is required",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()} //optioal chaining, csak akkor hivja,ha megvan ez a function, és nem undefined!
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? "Edit cabin" : "Create cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
