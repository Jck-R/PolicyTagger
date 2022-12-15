import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	// SideBar,
	Footer
} from './widgets';
import { getTheme } from './control/dark';
import { scrollWith } from './control/scroll';
import { Button, Form, Accordion, Spinner, ListGroup, Modal, Tab, Col, Nav, Row, Badge } from "react-bootstrap";
import axios from "axios";

const FeedbackButton = (props) => {
	return (
		<ListGroup.Item
			className="justify-content-center d-flex"
			action
			active={props.activeIndex[props.resultIndex] === props.index}
			onClick={() => {
				props.setActiveIndex((activeIndex) => {
					return activeIndex.map((x, i) => (i === props.resultIndex) ? props.index : x);
				});
			}}>
			{props.children}
		</ListGroup.Item>
	);
}

const SendFeedbackButton = (props) => {
	const sendFeedback = async (query, feedback) => {
		props.setSending(true);
		const formData = new FormData();
		formData.append("query", query);
		formData.append("feedback", JSON.stringify(feedback));
		try {
			const response = await axios.post("https://www.remisiki.com/api/v1/mm/43a3c1897d914a3fbec1ee4dd48b4fee/feedback", formData);
			props.setSending(false);
			if (response.status === 200 && !response.data.error) {
				setStatus("success");
			} else {
				setStatus("fail");
				console.error(response.data.message)
			}
		} catch(err) {
			props.setSending(false);
			console.error(err);
		}
	}
	const [status, setStatus] = useState("");
	const [message, setMessage] = useState({title: "", body: ""});
	useEffect(() => {
		if (status === "success") {
			setMessage({title: "Success", body: "Thank you for your response!"});
		} else if (status === "fail") {
			setMessage({title: "Error", body: "Ooops, something goes wrong. Contact maintainers for help."});
		}
	}, [status]);
	return (
		<>
			<Form
				className={props.className}
				style={props.style}
				onSubmit={(e) => {
					e.preventDefault();
					const formData = props.results.map((data, index) => {
						return {
							docno: data.docno,
							score: props.activeIndex[index] + 1
						};
					});
					sendFeedback(props.query, formData);
					}}
				>
				<Form.Group className={props.mobileView ? "d-grid" : ""}>
					<Button disabled={props.sending} variant="primary" type="submit">
						{props.sending ? <Spinner animation="border" variant="light" style={{height: "1em", width: "1em"}}/> : "Send Feedback"}
					</Button>
				</Form.Group>
			</Form>
			<Modal show={status !== ""} onHide={() => setStatus("")} >
				<Modal.Header closeButton>
					<Modal.Title>{message.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{message.body}</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={() => setStatus("")}>
						OK
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

const tagsToList = (tags) => {
	return Object.entries(tags).sort(x => x[1]).map(x => x[0]);
}

const Tags = (props) => {
	return (
		<div className="mb-3 mt-3">
			{tagsToList(props.tags).map((x, i) =>
				<Badge
					key={i}
					className="me-1"
					bg="secondary"
					title={x}
					onClick={() => props.modifyQuery(x)}
					>
					{x}
				</Badge>
			)
			}
		</div>
	);
}

const FindSimilarBtn = (props) => {
	return (
		<Button
			variant="primary"
			size="sm"
			onClick={() => {
				props.modifyQuery(tagsToList(props.tags).join(" "));
			}}
			>
			Find similar
		</Button>
	);
}

export const MainScreen = () => {
	const sections = Array.from({length: 4}, (v, k) => `s${k}`);
	const feedbackOptions = ["Very Irrelevant", "Irrelevant", "Somewhat", "Relevant", "Very Relevant"];
	const { t, i18n } = useTranslation();
	const [inputValue, setInputValue] = useState("");
	const [query, setQuery] = useState("");
	const [searching, setSearching] = useState(false);
	const [results, setResults] = useState([]);
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(Array(50).fill(0));
	const [mobileView, setMobileView] = useState(false);
	const [sending, setSending] = useState(false);
	const fetchSearchResult = async () => {
		setResults([]);
		setSearching(true);
		const formData = new FormData();
		formData.append("query", inputValue);
		try {
			const response = await axios.post("https://www.remisiki.com/api/v1/mm/43a3c1897d914a3fbec1ee4dd48b4fee", formData);
			setSearching(false);
			if (response.status === 200 && !response.data.error) {
				setResults(response.data.data);
			} else {
				setResults([]);
			}
			setActiveIndex(Array(50).fill(0));
		} catch(err) {
			setSearching(false);
			console.error(err);
			setResults([]);
			setActiveIndex(Array(50).fill(0));
		}
	}
	const modifyQuery = (query) => {
		setInputValue(query);
		setQuery(query);
		fetchSearchResult();
	}
	useEffect(() => {
		const external_links = document.querySelectorAll('a[href^=http]');
		for (const link of external_links) {
			link.setAttribute('target', '_blank');
		}
		setMobileView(window.innerWidth <= 425);
		scrollWith([]);
	}, []);
	return (
		<div>
			<div id="content" className="wrapper doc">
				<article id={sections[0]} className="float">
					<h1 style={{gridArea: "title"}} >{t("s0t")}</h1>
					<Form style={{gridArea: "search"}} onSubmit={(e) => {
						e.preventDefault();
						setQuery(inputValue);
						fetchSearchResult();
						}}>
						<Form.Group className="col-lg-10 w-100 d-flex justify-content-center align-items-center">
							<Form.Control
								className="me-3"
								value={inputValue}
								onInput={(e) => {
									setInputValue(e.target.value);
								}}
								type="search"
								/>
							<Button disabled={searching} variant="primary" type="submit">
								Go
							</Button>
						</Form.Group>
					</Form>
					{((results.length > 0) && (!mobileView)) ?
						<SendFeedbackButton
							className="d-flex flex-row"
							style={{gridArea: "submit", marginLeft: "5em"}}
							query={query}
							results={results}
							activeIndex={activeIndex}
							sending={sending}
							setSending={setSending}
							/> : ""
					}
					<div style={{gridArea: "result"}}>
					{
						(results.length > 0) ?
							<>
							{mobileView ?
							<>
							<Accordion className="mt-5">
							{
								results.map((item, index) => {
									return (
										<Accordion.Item eventKey={index} key={index} >
											<Accordion.Header onClick={() => setDetailsOpen(false)}>
												{item.title}
											</Accordion.Header>
											<Accordion.Body>
												<ListGroup className="mb-3" style={{fontSize: 13, overflow: "auto"}}>
													{feedbackOptions.map((option, optionIndex) => {
														return (
															<FeedbackButton
																key={optionIndex}
																index={optionIndex}
																resultIndex={index}
																setActiveIndex={setActiveIndex}
																activeIndex={activeIndex}
																>
																{option}
															</FeedbackButton>
														);
													})}
												</ListGroup>
												<FindSimilarBtn tags={item.kw} modifyQuery={modifyQuery} />
												<Tags tags={item.kw} modifyQuery={modifyQuery} />
												<b>ID</b>: {item.docno}
												<br/>
												<b>Score</b>: {item.score}
												<br/>
												<b>Area</b>: {item.area}
												<br/>
												<b>Applicability</b>: {item.applicability}
												<br/>
												<b>Owner</b>: {item.owner}
												<br/>
												<b>Link</b>: <a href={item.url}>{item.url}</a>
												<br/>
												<b>Details</b>: <p>
													{detailsOpen ? item.text : (item.text.slice(0, 300) + ((item.text.length > 300) && "..."))}
													<a
														href="#"
														onClick={(e) => {
														e.preventDefault();
														setDetailsOpen((detailsOpen) => !detailsOpen);
														}} >
														{detailsOpen ? "Close" : "See more"}
													</a>
												</p>
											</Accordion.Body>
										</Accordion.Item>
									);
								})
							}
							</Accordion>
							<SendFeedbackButton
								className="mt-3"
								mobileView
								query={query}
								results={results}
								activeIndex={activeIndex}
								sending={sending}
								setSending={setSending}
								/>
							</>
							:
							<Tab.Container defaultActiveKey={0}>
								<Row className="mt-3" style={{height: "calc(100% - 1em)"}} >
								<Col sm={8} style={{maxHeight: "100%", overflowY: "auto"}} >
									{
										results.map((item, index) =>
											<div className="d-flex flex-row align-items-center mb-3" key={index} >
											<ListGroup horizontal className="me-3 w-50" style={{fontSize: 11, overflow: "auto"}}>
												{feedbackOptions.map((option, optionIndex) => {
													return (
														<FeedbackButton
															key={optionIndex}
															index={optionIndex}
															resultIndex={index}
															setActiveIndex={setActiveIndex}
															activeIndex={activeIndex}
															>
															{option}
														</FeedbackButton>
													);
												})}
											</ListGroup>
											<Nav variant="pills" className="flex-column text-truncate w-50" title={item.title} >
												<Nav.Item key={index}>
													<Nav.Link eventKey={index} onClick={() => {setDetailsOpen(false)}} >{item.title}</Nav.Link>
												</Nav.Item>
											</Nav>
											</div>
										)
									}
								</Col>
								<Col sm={3} className="ms-3" style={{maxHeight: "100%", overflowY: "auto"}} >
									<Tab.Content>
										{
											results.map((item, index) =>
												<Tab.Pane eventKey={index} key={index} >
													<h3>{item.title}</h3>
													<FindSimilarBtn tags={item.kw} modifyQuery={modifyQuery} />
													<Tags tags={item.kw} modifyQuery={modifyQuery} />
													<b>ID</b>: {item.docno}
													<br/>
													<b>Score</b>: {item.score}
													<br/>
													<b>Area</b>: {item.area}
													<br/>
													<b>Applicability</b>: {item.applicability}
													<br/>
													<b>Owner</b>: {item.owner}
													<br/>
													<b>Link</b>: <a href={item.url}>{item.url}</a>
													<br/>
													<b>Details</b>: <p>
														{detailsOpen ? item.text : (item.text.slice(0, 400) + ((item.text.length > 400) && "..."))}
														<a
															href="#"
															onClick={(e) => {
															e.preventDefault();
															setDetailsOpen((detailsOpen) => !detailsOpen);
															}} >
															{detailsOpen ? "Close" : "See more"}
														</a>
													</p>
												</Tab.Pane>
											)
										}
									</Tab.Content>
								</Col>
								</Row>
							</Tab.Container>
							}
							</>
						: (
							searching ?
							<div className="d-flex mt-3">
								<b className="me-3">Please wait...</b>
								<Spinner animation="border" variant="primary" style={{height: "1em", width: "1em"}}/>
							</div>
							:
							<b className="d-flex mt-3">
								Empty Results
							</b>
						)
					}
					</div>
				</article>
				<div className="gap"></div>
			</div>
			<Footer />
		</div>
	);
}
