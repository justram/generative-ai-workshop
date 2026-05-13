import{__decorate as e,i$1 as t,i18n as n,t$1 as r,x as i}from"./ThemeToggle-zh-tw7.js";import"./Textarea-DCZnYrSo.js";import"./Dialog-C7MHz9Dg.js";import"./Input-0pADT9gU.js";import"./mini-zh-tw7.js";let a=class extends t{createRenderRoot(){return this}render(){return i`
			<div class="min-h-screen p-4 lg:p-8">
				<div class="fixed top-4 right-4 z-10 flex items-center gap-2">
					<language-selector></language-selector>
					<theme-toggle includeSystem></theme-toggle>
				</div>
				<div class="max-w-6xl mx-auto">
					<h1 class="text-3xl lg:text-4xl text-foreground font-bold mb-4">${n(`Generative AI Workshop`)}</h1>

					<p class="text-sm text-muted-foreground mb-8 leading-relaxed">
						${n(`Created by`)} <strong>Mario Zechner</strong> (<a
							href="https://mariozechner.at"
							target="_blank"
							class="underline hover:no-underline"
							>mariozechner.at</a
						>, <a href="mailto:contact@mariozechner.at" class="underline hover:no-underline">contact@mariozechner.at</a>).<br />
						${n(`Translated and maintained by`)} <strong>Jheng-Hong (Matt) Yang / 楊政紘</strong> (<a href="https://justram.github.io" target="_blank" class="underline hover:no-underline">justram.github.io</a>, <a href="mailto:jhyang@stencilzeit.com" class="underline hover:no-underline">jhyang@stencilzeit.com</a>), Stencilzeit.
					</p>

					<div class="space-y-6">
						<!-- Section 1 -->
						<div class="p-4 border border-border rounded-md bg-card text-card-foreground shadow-xs">
							<a href="1-introduction.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
								<h2 class="text-lg font-semibold">${n(`1. What this workshop is and isn't`)}</h2>
								<p class="text-sm text-muted-foreground mt-1">${n(`Overview of what you'll learn in this workshop`)}</p>
							</a>
						</div>

						<!-- Section 2 -->
						<div class="p-4 border border-border rounded-md bg-card text-card-foreground shadow-xs">
							<a href="2-what-is-llm.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
								<h2 class="text-lg font-semibold">${n(`2. What is a Large Language Model?`)}</h2>
								<p class="text-sm text-muted-foreground mt-1">${n(`Interactive exploration of how LLMs work`)}</p>
							</a>
						</div>

						<!-- Section 3 with subsections -->
						<div class="p-4 border border-border rounded-md bg-card text-card-foreground shadow-xs">
							<h2 class="text-lg font-bold mb-3 px-3">${n(`3. Understanding Chatbots`)}</h2>
							<div class="space-y-2">
								<a href="3-1-chatbot-interface.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">3.1</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`The Fundamental Illusion`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">
												${n(`How chatbot interfaces work behind the scenes`)}
											</p>
										</div>
									</div>
								</a>

								<a href="3-2-providers-models.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">3.2</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Providers and Models`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`AI providers and their different models`)}</p>
										</div>
									</div>
								</a>

								<a href="3-3-context-window.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">3.3</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Context Window`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Context limits and memory limitations`)}</p>
										</div>
									</div>
								</a>

								<a href="3-4-document-upload.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">3.4</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Document Upload`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`What happens when you upload PDFs`)}</p>
										</div>
									</div>
								</a>

								<a href="3-5-multi-document.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">3.5</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Multiple Documents`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Multi-document synthesis challenges`)}</p>
										</div>
									</div>
								</a>

								<a href="3-6-image-demo.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">3.6</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Image Upload`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Test vision model limitations`)}</p>
										</div>
									</div>
								</a>

								<a href="3-7-hidden-costs.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">3.7</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`The (Hidden) Costs`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Watch costs add up in real-time`)}</p>
										</div>
									</div>
								</a>

								<a href="3-8-practice.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">3.8</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Key Takeaways`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Real-world limitations of chatbots`)}</p>
										</div>
									</div>
								</a>
							</div>
						</div>

						<!-- Section 4 with subsections -->
						<div class="p-4 border border-border rounded-md bg-card text-card-foreground shadow-xs">
							<h2 class="text-lg font-bold mb-3 px-3">${n(`4. Prompting Techniques`)}</h2>
							<div class="space-y-2">
								<a href="4-overview.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">4.0</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Prompting Overview`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`The reality of prompting and key techniques`)}</p>
										</div>
									</div>
								</a>

								<a href="4-1-personas.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">4.1</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Personas`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Make LLMs roleplay with personalities`)}</p>
										</div>
									</div>
								</a>

								<a href="4-2-structured-io.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">4.2</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Structured I/O`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Delimiters and formats for parsing`)}</p>
										</div>
									</div>
								</a>

								<a href="4-3-chain-of-thought.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">4.3</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Chain of Thought`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Step-by-step reasoning`)}</p>
										</div>
									</div>
								</a>

								<a href="4-4-grounding.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">4.4</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Grounding`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Prevent hallucination with references`)}</p>
										</div>
									</div>
								</a>

								<a href="4-5-nlp-tasks.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">4.5</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`NLP Tasks`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Language processing with simple verbs`)}</p>
										</div>
									</div>
								</a>

								<a href="4-6-few-shot.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">4.6</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Few-Shot Learning`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Teach patterns through examples`)}</p>
										</div>
									</div>
								</a>

								<a href="4-7-prompt-chaining.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">4.7</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Prompt Chaining`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Break complex tasks into steps`)}</p>
										</div>
									</div>
								</a>

								<a href="4-8-self-correction.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">4.8</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Self-Correction`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Iterative improvement`)}</p>
										</div>
									</div>
								</a>

								<a href="4-9-prompt-injection.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">4.9</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Prompt Injection`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Security awareness`)}</p>
										</div>
									</div>
								</a>

								<a href="4-10-takeaways.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">4.10</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Key Takeaways`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Best practices summary`)}</p>
										</div>
									</div>
								</a>
							</div>
						</div>

						<!-- Section 5: RAG -->
						<div class="p-4 border border-border rounded-md bg-card text-card-foreground shadow-xs">
							<h2 class="text-lg font-bold mb-3 px-3">${n(`5. Retrieval Augmented Generation (RAG)`)}</h2>
							<div class="space-y-2">
								<a href="5-overview.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">5.0</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`RAG Overview`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Teaching LLMs about your data`)}</p>
										</div>
									</div>
								</a>

								<a href="5-1-embeddings-intro.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">5.1</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Understanding Embeddings`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">
												${n(`Simple introduction to embeddings with 42 movies`)}
											</p>
										</div>
									</div>
								</a>

								<a href="5-2-semantic-search.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">5.2</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Semantic Search`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">
												${n(`Interactive embedding visualization with document viewer`)}
											</p>
										</div>
									</div>
								</a>

								<a href="5-3-rag-in-action.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">5.3</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`RAG in Action`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Real-world RAG implementations`)}</p>
										</div>
									</div>
								</a>
							</div>
						</div>

						<!-- Section 6: Agents -->
						<div class="p-4 border border-border rounded-md bg-card text-card-foreground shadow-xs">
							<h2 class="text-lg font-bold mb-3 px-3">${n(`6. Agents: Giving LLMs Tools`)}</h2>
							<div class="space-y-2">
								<a href="6-overview.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">6.0</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Agents Overview`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Introduction to tool use`)}</p>
										</div>
									</div>
								</a>

								<a href="6-1-tool-invocation.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">6.1</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Tool Invocation`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`How LLMs call tools and risks`)}</p>
										</div>
									</div>
								</a>

								<a href="6-2-calculator-tool.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">6.2</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Calculator Tool`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`LLMs are bad at math`)}</p>
										</div>
									</div>
								</a>

								<a href="6-3-datetime-tool.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">6.3</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Date/Time Tool`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`LLMs have no real-time awareness`)}</p>
										</div>
									</div>
								</a>

								<a href="6-4-websearch-tool.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">6.4</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Web Search Tool`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Breaking the knowledge cutoff`)}</p>
										</div>
									</div>
								</a>

								<a href="6-5-artifacts-tool.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">6.5</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Artifacts Tool`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Co-creating documents with LLMs`)}</p>
										</div>
									</div>
								</a>

								<a href="6-6-mcp.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">6.6</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Model Context Protocol`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Live demo with bash tool`)}</p>
										</div>
									</div>
								</a>

								<a href="6-7-key-takeaways.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">6.7</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Key Takeaways`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">${n(`Tools, agents, and risks`)}</p>
										</div>
									</div>
								</a>
							</div>
						</div>

						<!-- Section 7: Self-Hosting -->
						<div class="p-4 border border-border rounded-md bg-card text-card-foreground shadow-xs">
							<h2 class="text-lg font-bold mb-3 px-3">${n(`7. Self-Hosting LLMs`)}</h2>
							<div class="space-y-2">
								<a href="7-overview.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">7.0</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`Self-Hosting Overview`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">
												${n(`What is self-hosting and when does it make sense`)}
											</p>
										</div>
									</div>
								</a>

								<a href="7-1-models.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">7.1</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`7.1 Models: What to Run and Where to Find Them`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">
												${n(`Closed vs open models, sizes, and where to find them`)}
											</p>
										</div>
									</div>
								</a>

								<a href="7-2-software-stack.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">7.2</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`7.2 Understanding the Software Stack`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">
												${n(`Models, inference engines, APIs, and UIs`)}
											</p>
										</div>
									</div>
								</a>

								<a href="7-3-hardware.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">7.3</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`7.3 Hardware: What You Actually Need`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">
												${n(`GPUs, consumer hardware, and cloud options`)}
											</p>
										</div>
									</div>
								</a>

								<a href="7-4-demos.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
									<div class="flex items-start gap-2">
										<span class="text-xs font-mono text-muted-foreground mt-0.5">7.4</span>
										<div class="flex-1">
											<h3 class="font-medium">${n(`7.4 Hands-On Demos`)}</h3>
											<p class="text-xs text-muted-foreground mt-0.5">
												${n(`Ollama, LM Studio, and DataCrunch + Jan.ai`)}
											</p>
										</div>
									</div>
								</a>
							</div>
						</div>

						<!-- Section 8 -->
						<div class="p-4 border border-border rounded-md bg-card text-card-foreground shadow-xs">
							<a href="8-where-to-go.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
								<h2 class="text-lg font-semibold">${n(`8. Where to go from here`)}</h2>
								<p class="text-sm text-muted-foreground mt-1">${n(`Resources, tools, and next steps for your AI journey`)}</p>
							</a>
						</div>

						<!-- Full Content View -->
						<div class="p-4 border border-border rounded-md bg-card text-card-foreground shadow-xs">
							<a href="0-full-content.html" class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
								<h2 class="text-lg font-semibold">${n(`Full Workshop Content`)}</h2>
								<p class="text-sm text-muted-foreground mt-1">
									${n(`View all workshop content in one page with table of contents`)}
								</p>
							</a>
						</div>
					</div>
				</div>
			</div>
		`}};a=e([r(`workshop-index`)],a);const o=document.createElement(`workshop-index`);document.body.appendChild(o);export{a as WorkshopIndex};