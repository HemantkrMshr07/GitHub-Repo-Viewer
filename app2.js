function fetchRepositories() {
    const username = $('#username').val();
    const perPage = $('#perPage').val();
    const repositoriesList = $('#repositories-list');
    const paginationInfo = $('#pagination-info');
    const loader = $('#loader');

    loader.removeClass('d-none');
    repositoriesList.empty();
    paginationInfo.empty();

    $.ajax({
        url: `/repositories/${username}`,
        data: { perPage: perPage, page: 1 },
        method: 'GET',
        success: function (data) {
            const repositories = data.repositories;
            const pagination = data.pagination;

            repositories.forEach(repo => {
                const listItem = $('<li>').addClass('list-group-item');
                listItem.html(`<strong>${repo.name}</strong>: ${repo.description || 'No description available.'}<br>Topics: ${repo.topics.join(', ')}<br><a href="${repo.url}" target="_blank">View on GitHub</a>`);
                repositoriesList.append(listItem);
            });

            paginationInfo.html(`Page ${pagination.currentPage} of ${pagination.totalPages}, Total Repositories: ${pagination.totalItems}`);

            if (pagination.totalPages > 1) {
                renderPaginationControls(pagination);
            }

            loader.addClass('d-none');
        },
        error: function (error) {
            console.error('Error fetching repositories:', error);
            loader.addClass('d-none');
        }
    });
}

function renderPaginationControls(pagination) {
    const paginationInfo = $('#pagination-info');
    const prevButton = $('<button>').addClass('btn btn-primary mr-2').text('Previous');
    const nextButton = $('<button>').addClass('btn btn-primary').text('Next');

    prevButton.on('click', function () {
        if (pagination.currentPage > 1) {
            fetchRepositories(pagination.currentPage - 1);
        }
    });

    nextButton.on('click', function () {
        if (pagination.currentPage < pagination.totalPages) {
            fetchRepositories(pagination.currentPage + 1);
        }
    });

    paginationInfo.append(prevButton, nextButton);
}
