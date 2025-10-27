export interface EchoToolParams {
  message: string;
}

export const echoTool = {
  name: "echo",
  description: "Echo back a message",
  async execute(params: EchoToolParams) {
    return {
      content: [
        {
          type: "text",
          text: params.message,
        },
      ],
    };
  },
};
