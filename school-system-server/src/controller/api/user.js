import { Router } from "express";
import { authenticate, availableFor } from "../../utils";
import { CreateAbl } from "../../abl/user/create.abl.js";
import { ListAbl } from "../../abl/user/list.abl.js";
import { GetAbl } from "../../abl/user/get.abl.js";
import { UpdatePasswordAbl } from "../../abl/user/updatePassword.abl.js";
import { UpdateAbl } from "../../abl/user/update.abl.js";
import { DeleteAbl } from "../../abl/user/delete.abl.js";

const router = Router();

// create user
router.post(
  "/create",
  authenticate(),
  availableFor(["ADMIN"]),
  async (req, res) => {
    await CreateAbl(req, res);
  }
);

// list all users
router.get(
  "/list",
  authenticate(),
  availableFor(["ADMIN", "USER"]),
  async (req, res) => {
    await ListAbl(req, res);
  }
);

// get user by id
router.get(
  "/:id",
  authenticate(),
  availableFor(["ADMIN", "$_CURRENT_USER"]),
  async (req, res) => {
    await GetAbl(req, res);
  }
);

// update password
router.post(
  "/update/password",
  authenticate(),
  availableFor(["ADMIN", "$_CURRENT_USER"]),
  async (req, res) => {
    await UpdatePasswordAbl(req, res);
  }
);

// update user
router.post(
  "/update",
  authenticate(),
  availableFor(["ADMIN"]),
  async (req, res) => {
    await UpdateAbl(req, res);
  }
);

// delete
router.post(
  "/delete",
  authenticate(),
  availableFor(["ADMIN"]),
  async (req, res) => {
    await DeleteAbl(req, res);
  }
);

export default router;
