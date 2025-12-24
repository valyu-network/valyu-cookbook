## Create a Heavy Research Task and Wait for Completion

Use `heavy` mode for complex research.

First step, create a research task and use the `heavy` model.

_TypeScript_
```ts
import { Valyu } from "valyu-js";

const valyu = new Valyu(YOUR_VALYU_API_KEY_HERE);

// Create a research task
const task = await valyu.deepresearch.create({
  input: "Analyze the competitive landscape of the cloud computing market in 2024",
  model: "heavy"
});

console.log(`Task created: ${task.deepresearch_id}`);
console.log(`Status: ${task.status}`);
```

Second step, wait for completion of the task

_TypeScript_
```ts
// Wait for the task to complete
const result = await valyu.deepresearch.wait(task.deepresearch_id, {
  pollInterval: 5000,    // Check every 5 seconds
});

if (result.status === "completed") {
  console.log("Research completed!");
  console.log(result.output);
  
  // Access sources used
  result.sources?.forEach(source => {
    console.log(`- ${source.title}: ${source.url}`);
  });
  
  // Check costs
  console.log(`Total cost: $${result.usage?.total_cost.toFixed(4)}`);
}
```

_Python_
```python
# Wait for the task to complete
result = valyu.deepresearch.wait(
    task.deepresearch_id,
    poll_interval=5,      # Check every 5 seconds
)

if result.status == "completed":
    print("Research completed!")
    print(result.output)
    
    # Access sources used
    for source in result.sources:
        print(f"- {source.title}: {source.url}")
    
    # Check costs
    print(f"Total cost: ${result.usage.total_cost:.4f}")
```