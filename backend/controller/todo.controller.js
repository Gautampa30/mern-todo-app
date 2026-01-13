import Todo from "../model/todo.model.js";

export const createTodo = async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    completed: req.body.completed,
    user: req.user._id, //associate todo with loggedin user
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json({ message: "Todo created successfully", newTodo });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error occuring in todo creation" });
  }
};

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }); //fetch todo only for loggedin user.
    res.status(200).json({ message: "Todos fetched successfully", todos });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error occuring in todo fetching" });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      {
        new: true,
      }
    );
    if (!todo) {
      return res
        .status(404)
        .json({ message: "Todo not found or unauthorized" });
    }
    res.status(200).json({ message: "Todo updated successfully", todo });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error occuring in todo updating" });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!todo) {
      return res
        .status(404)
        .json({ message: "Todo not found or unauthorized" });
    }
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error occuring in todo deleting" });
  }
};
