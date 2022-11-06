import { useCallback, useEffect } from "react";
import { useApp } from "../contexts/appContext";
import {
  fetchUsers,
  fetchUser,
  deleteUser,
  updateUser,
  createUser,
  updateUserPassword,
  fetchGateways,
  createGateway,
  deleteGateway,
} from "../utils/api";
import useSWR from "swr";

const contentMap = {
  users: fetchUsers,
  user: fetchUser,
  gateways: fetchGateways,
};

const deleteContentMap = {
  user: deleteUser,
  gateway: deleteGateway,
};

const editContentMap = {
  user: updateUser,
  userPassword: updateUserPassword,
};

const addContentMap = {
  user: createUser,
  gateway: createGateway,
};

export const useContent = (contentName, id) => {
  const { setError } = useApp();
  const { data, error } = useSWR([contentName, id], (contentName, id) =>
    contentMap[contentName]?.(id)
  );

  useEffect(() => {
    if (error) {
      setError(error?.message || "Failed to download data");
    }
  }, [error, setError]);

  return { data, error };
};

export const useDeleteContent = (contentName, id) => {
  const { setError, setSuccess } = useApp();

  const remove = useCallback(async () => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return false;
    }

    try {
      if (!deleteContentMap[contentName]) {
        throw new Error();
      }
      await deleteContentMap[contentName]?.({ id });
      setSuccess(`Record has been deleted`);
      return true;
    } catch (error) {
      setError(error?.message || "Unable to remove a record");
      return false;
    }
  }, [contentName, id, setError, setSuccess]);

  return remove;
};

export const useAddContent = (contentName) => {
  const { setError, setSuccess } = useApp();

  const add = useCallback(
    async (body) => {
      try {
        if (!addContentMap[contentName]) {
          throw new Error();
        }
        await addContentMap[contentName]?.(body);
        setSuccess(`Record has been created`);
        return true;
      } catch (error) {
        setError(error?.message || "Unable to add a record");
        return false;
      }
    },
    [contentName, setError, setSuccess]
  );

  return add;
};

export const useEditContent = (contentName) => {
  const { setError, setSuccess } = useApp();

  const edit = useCallback(
    async (body) => {
      try {
        if (!editContentMap[contentName]) {
          throw new Error();
        }
        await editContentMap[contentName]?.(body);
        setSuccess(`Record has been updated`);
        return true;
      } catch (error) {
        setError(error?.message || "Unable to update a record");
        return false;
      }
    },
    [contentName, setError, setSuccess]
  );

  return edit;
};
