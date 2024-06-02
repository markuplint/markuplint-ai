import specs from '@markuplint/html-spec';
import { createTestDocument } from '@markuplint/ml-core';
import { test, expect } from 'vitest';

import { fromDocument, toLiteTree } from './index.js';

test('toLiteTree', () => {
	const doc = createTestDocument(
		`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Document</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1><img src="path/to" alt="Our Website"></h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section aria-labelledby="home">
            <h2 id="home">Home</h2>
            <p>Welcome to our homepage. Here you can find information about our latest projects and services.</p>
            <img src="home.jpg" alt="A view of our office">
        </section>
        <section aria-labelledby="about">
            <h2 id="about">About Us</h2>
            <article>
                <h3>Our Mission</h3>
                <p>We aim to provide the best customer service and innovative solutions to our clients.</p>
            </article>
            <article>
                <h3>History</h3>
                <p>Founded in 2000, our company has grown significantly over the years, expanding our service offerings and client base.</p>
            </article>
        </section>
        <section id="services">
            <h2>Services</h2>
            <article>
                <h3>Web Development</h3>
                <p>We offer custom web development services, including responsive design, e-commerce solutions, and web maintenance.</p>
            </article>
            <article>
                <h3>Marketing</h3>
                <p>Our marketing team specializes in SEO, digital marketing campaigns, and social media strategy to help your business grow.</p>
            </article>
        </section>
        <section id="contact">
            <h2>Contact Us</h2>
            <form action="submit.php" method="post">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
                <label for="message">Message:</label>
                <textarea id="message" name="message" rows="4" required></textarea>
                <button type="submit">Send</button>
            </form>
        </section>
    </main>
    <footer>
        <p>&copy; 2024 Sample Company. All rights reserved.</p>
    </footer>
</body>
</html>
`,
		{
			specs,
		},
	);

	const tree = fromDocument(doc);
	const lite = toLiteTree(tree);

	expect(lite.tree).toStrictEqual([
		'heading(level="1")=Our Website',
		'  img=Our Website',
		'navigation',
		'  list',
		'    listitem',
		'      link=Home',
		'    listitem',
		'      link=About Us',
		'    listitem',
		'      link=Services',
		'    listitem',
		'      link=Contact',
		'main',
		'  region(labelledby="home")=Home',
		'    heading(level="2")=Home',
		'    paragraph',
		'      | Welcome to our homepage. Here you can find information about our latest projects and services.',
		'    img=A view of our office',
		'  region(labelledby="about")=About Us',
		'    heading(level="2")=About Us',
		'    article',
		'      heading(level="3")=Our Mission',
		'      paragraph',
		'        | We aim to provide the best customer service and innovative solutions to our clients.',
		'    article',
		'      heading(level="3")=History',
		'      paragraph',
		'        | Founded in 2000, our company has grown significantly over the years, expanding our service offerings and client base.',
		'  heading(level="2")=Services',
		'  article',
		'    heading(level="3")=Web Development',
		'    paragraph',
		'      | We offer custom web development services, including responsive design, e-commerce solutions, and web maintenance.',
		'  article',
		'    heading(level="3")=Marketing',
		'    paragraph',
		'      | Our marketing team specializes in SEO, digital marketing campaigns, and social media strategy to help your business grow.',
		'  heading(level="2")=Contact Us',
		'  | Name:',
		'  textbox(required="true")=Name:',
		'  | Email:',
		'  textbox(required="true")=Email:',
		'  | Message:',
		'  textbox(required="true")=Message:',
		'  button=Send',
		'contentinfo',
		'  paragraph',
		'    | &copy; 2024 Sample Company. All rights reserved.',
	]);
});
