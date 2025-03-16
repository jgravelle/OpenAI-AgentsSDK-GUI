export const modelOptions = [
  {
    value: "gpt-4o",
    label: "GPT-4o",
    description: "Most capable model for a wide range of tasks (default)"
  },
  {
    value: "o3-mini",
    label: "O3-mini",
    description: "Faster and more cost-effective model for simpler tasks"
  },
  {
    value: "gpt-4o-mini",
    label: "GPT-4o-mini",
    description: "Smaller, faster version of GPT-4o"
  }
];

export const modelSettingsDefaults = {
  temperature: 0.7,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  maxTokens: 4096
};