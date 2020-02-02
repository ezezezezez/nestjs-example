import { Test } from "@nestjs/testing";
import { TaskService } from "./task.service";
import { TaskRepository } from "./task.repository";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { NotFoundException } from "@nestjs/common";

const mockUserId: number = 1;
const mockTaskRepositoryFactory = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn()
});

describe("TaskService", () => {
  let taskService;
  let taskRepository;
  const mockTaskId = 100;
  const mockFoundValue = {
    title: "Test task",
    description: "Test desc"
  };
  const mockNotFoundValue = undefined;
  const mockCreateTaskDto = {
    title: "Test task",
    description: "Test description"
  };
  const mockUpdateTaskDto = {
    title: "new title",
    description: "new description",
    status: TaskStatus.IN_PROGRESS
  };
  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: TaskRepository, useFactory: mockTaskRepositoryFactory }
      ]
    }).compile();
    taskService = await testModule.get<TaskService>(TaskService);
    taskRepository = await testModule.get<TaskRepository>(TaskRepository);
  });

  describe("getTasks", () => {
    it("gets all tasks from the repository", async () => {
      taskRepository.getTasks.mockResolvedValue("somevalue");
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const getTasksFilterDto: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        q: "Some search query"
      };
      // call taskService.getTasks
      const result = await taskService.getTasks(getTasksFilterDto, mockUserId);
      // expect taskRepository.getTasks TO HAVE BEEN CALLED
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual("somevalue");
    });
  });
  describe("getTaskById", () => {
    it("calls taskRepository.getTaskById() and successfully retrieve and return the task", async () => {
      taskRepository.findOne.mockResolvedValue(mockFoundValue);
      const result = await taskService.getTaskById(mockTaskId, mockUserId);
      expect(result).toEqual(mockFoundValue);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockTaskId, userId: mockUserId }
      });
    });
    it("throws an error as task is not found", () => {
      taskRepository.findOne.mockResolvedValue(mockNotFoundValue);
      return expect(
        taskService.getTaskById(mockTaskId, mockUserId)
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe("createTask", () => {
    it("call taskRepository.createTask() and returns the result", async () => {
      taskRepository.createTask.mockResolvedValue("someTask");
      expect(taskRepository.createTask).not.toHaveBeenCalled();
      const result = await taskService.createTask(
        mockCreateTaskDto,
        mockUserId
      );
      expect(taskRepository.createTask).toHaveBeenCalledWith(
        mockCreateTaskDto,
        mockUserId
      );
      expect(result).toEqual("someTask");
    });
  });
  describe("deleteTask", () => {
    it("calls taskRepository.deleteTask() to delete a task", async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      await taskService.deleteTaskById(mockTaskId, mockUserId);
      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: mockTaskId,
        userId: mockUserId
      });
    });
    it("throws an error as task could not be found", async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      expect(
        taskService.deleteTaskById(mockTaskId, mockUserId)
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe("updateTask", () => {
    it("updates a task status", async () => {
      const save = jest.fn().mockResolvedValue(true);
      taskService.getTaskById = jest.fn().mockResolvedValue({
        title: "old title",
        description: "old description",
        status: TaskStatus.OPEN,
        save
      });
      expect(taskService.getTaskById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      const result = await taskService.updateTaskById(
        mockTaskId,
        mockUpdateTaskDto,
        mockUserId
      );
      expect(taskService.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(mockUpdateTaskDto.status);
    });
  });
});
