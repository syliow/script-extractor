This markdown explains some of my thought process and decisions for this assessment (Optional)

- My raw thoughts during planning phase for this assessment, this includes me writting down whatever information i think its required and would help me to form the direction and thought process (note: the document is messy)
https://docs.google.com/document/d/1HiN3E6ursmYHFIQiai-TA_xLUkgf-0qAwGaileTrSQ4/edit?usp=sharing 

How did i approach this take home assessment
1. Plan: read the task, then wrote my requirements, edge cases and design questions in the doc above before coding.
2. Research: Doing research + deciding which LLM API should i use for this task 
3. Testing: wrote and tuned the prompt myself, using the provided samples as test cases to check for (cancelled text, inserted text etc)
4. Develop: Used Cursor as coding assistant to help with the boilerplate code due to the short time limit (I still manually review each line added and made neccessary changes)

Most of my time went into steps 1-3, because I wanted to design something I fully understand and can explain.


Tradeoffs:
1. Why did i pick Gemini? (Gemini flash-3.5-lite)
Pros: Free plan with generous quota, decent performance and accepts PDF documents (500 daily API requests on free plan)
Cons: smaller model, not comparable against paid models

2. Edge cases not covered: password protected pdf, pdf with many pages (>50),handwriting in other langugages such as chinese and malay (not tested)