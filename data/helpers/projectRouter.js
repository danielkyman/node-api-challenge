const express = require("express");
const Projects = require("./projectModel.js");
const router = express.Router();

router.get("/", (req, res) => {
  Projects.get()
    .then((projects) => {
      res.status(200).json(projects);
    })
    .catch((err) => {
      res.status(500).json({
        message: "error retrieving projects",
      });
    });
});

router.get("/:id", verifyId, (req, res) => {
  Projects.get(req.params.id)
    .then((project) => {
      if (!project) {
        console.log(project.length);
        res.status(500).json({
          message: "error retrieving projects",
        });
      } else if (project) {
        res.status(200).json(project);
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "error retrieving projects",
      });
    });
});

router.post("/", (req, res) => {
  const projectInfo = req.body;

  if (
    !projectInfo.hasOwnProperty("name") ||
    !projectInfo.hasOwnProperty("description")
  ) {
    next("error");
  } else {
    Projects.insert(projectInfo)
      .then((projects) => {
        res.status(200).json(projects);
      })
      .catch((err) => {
        next("error");
      });
  }
});

router.delete("/:id", verifyId, (req, res) => {
  Projects.remove(req.params.id)
    .then((projects) => {
      res
        .status(200)
        .json({ message: `successfully deleted ${projects} projects` });
    })
    .catch((err) => {
      next("error");
    });
});

router.put("/:id", verifyId, (req, res) => {
  const projectInfo = req.body;

  if (
    !projectInfo.hasOwnProperty("name") ||
    !projectInfo.hasOwnProperty("description")
  ) {
    next("error");
  } else {
    Projects.update(req.params.id, projectInfo)
      .then((project) => {
        res.status(200).json(project);
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
    .json({ error: "projects error handling middleware has been triggered" });
});

function verifyId(req, res, next) {
  const id = req.params.id;
  if (!id) {
    next("error");
  } else {
    Projects.get(id)
      .then((projects) => {
        if (projects) {
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
