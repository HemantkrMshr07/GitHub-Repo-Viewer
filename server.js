const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/repositories/:username', async (req, res) => {
    const username = req.params.username;
    const perPage = Math.min(parseInt(req.query.perPage) || 10, 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    try {
        const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
            params: {
                per_page: perPage,
                page: page,
            },
        });

        const repositories = response.data.map(repo => ({
            name: repo.name,
            url: repo.html_url,
            description: repo.description,
            topics: repo.topics || [],
        }));

        const pagination = {
            totalItems: parseInt(response.headers['x-total-count']),
            totalPages: Math.ceil(parseInt(response.headers['x-total-count']) / perPage),
            currentPage: page,
            perPage: perPage,
        };

        res.json({ repositories, pagination });
    } catch (error) {
        res.status(404).json({ error: 'User not found or no public repositories.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
