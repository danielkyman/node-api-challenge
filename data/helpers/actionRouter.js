const express = require("express");
const Actions = require("./actionModel.js");
const router = express.Router();

router.get("/", (req, res) => {
  Actions.get()
    .then((actions) => {
      res.status(200).json(actions);
    })
    .catch((err) => {
      res.status(500).json({
        message: "error retrieving actions",
      });
    });
});

router.get("/:id", verifyId, (req, res) => {
  Actions.get(req.params.id)
    .then((action) => {
      if (!action) {
        console.log(action.length);
        res.status(500).json({
          message: "error retrieving actions",
        });
      } else if (action) {
        res.status(200).json(action);
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "error retrieving actions",
      });
    });
});

router.post("/", (req, res) => {
  const actionInfo = req.body;

  if (
    !actionInfo.hasOwnProperty("project_id") ||
    !actionInfo.hasOwnProperty("description") ||
    !actionInfo.hasOwnProperty("notes")
  ) {
    next("error");
  } else {
    Actions.insert(actionInfo)
      .then((actions) => {
        res.status(200).json(actions);
      })
      .catch((err) => {
        next("error");
      });
  }
});

router.delete("/:id", verifyId, (req, res) => {
  Actions.remove(req.params.id)
    .then((actions) => {
      res
        .status(200)
        .json({ message: `successfully deleted ${actions} actions` });
    })
    .catch((err) => {
      next("error");
    });
});

router.put("/:id", verifyId, (req, res) => {
  const actionInfo = req.body;

  if (
    !actionInfo.hasOwnProperty("project_id") ||
    !actionInfo.hasOwnProperty("description") ||
    !actionInfo.hasOwnProperty("notes")
  ) {
    next("error");
  } else {
    Actions.update(req.params.id, actionInfo)
      .then((action) => {
        res.status(200).json(action);
      })
      .catch((err) => {
        next("error");
      });
  }
});

module.exports = router;

router.use((error, req, res, next) => {
  res
    .status(400)
    .json({ error: "actions error handling middleware has been triggered" });
});

function verifyId(req, res, next) {
  const id = req.params.id;
  if (!id) {
    next("error");
  } else {
    Actions.get(id)
      .then((actions) => {
        if (actions) {
          next();
        } else {
          next("error");
        }
      })
      .catch((err) => {
        next("error");
      });
  }
}
