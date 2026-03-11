import supabase, { supabaseUrl } from "./supabase";

//creating queries that return all filds from the cabins table
export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("cabins could not be loaded");
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  console.log(newCabin, id);

  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  //create unique image name
  const imageName = `${Math.random()} - ${newCabin.image.name}`.replaceAll(
    "/",
    "",
  );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
  // https://upnlqbwoviylknzaewox.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg

  //1. Create/edit cabin
  let query = supabase.from("cabins");

  //A - CREATE without image to get the id
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]); //single, hogy ne tömböt adjon vissza, hanem egy objektumot, mert csak egy kabint hozunk létre

  //B - EDIT
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("cabin could not be created");
  }

  // 2. Upload image to storage with the cabin id as part of the file path
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // Delete the cabin IF there was an errr uploading image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error(
      "cabin image could not be uploaded - cabin creation cancelled",
    );
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("cabin could not be deleted");
  }

  return data;
}
