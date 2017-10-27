$(document).ready(() => 
    $('.delete-article').on('click', e => {
        $target = $(e.target)
        const id = $target.attr('data-id')
        $.ajax({
            type: 'DELETE',
            url: '/articles/' + id,
            success: response => {
                alert('Видалення новини')
                window.location.href='/news'
            },
            error: err => console.log(err)
        })
    }))

$(document).ready(() => 
    $('.delete-direction').on('click', e => {
        $target = $(e.target)
        const id = $target.attr('data-id')
        $.ajax({
            type: 'DELETE',
            url: '/directions/' + id,
            success: response => {
                alert('Видалення напряму')
                window.location.href='/direct'
            },
            error: err => console.log(err)
        })
    }))

$(document).ready(() => 
    $('.delete-researcher').on('click', e => {
        $target = $(e.target)
        const id = $target.attr('data-id')
        $.ajax({
            type: 'DELETE',
            url: '/researchers/' + id,
            success: response => {
                alert('Видалення дослідника')
                window.location.href='/research'
            },
            error: err => console.log(err)
        })
    }))

$(document).ready(() => 
    $('.delete-contact').on('click', e => {
        $target = $(e.target)
        const id = $target.attr('data-id')
        $.ajax({
            type: 'DELETE',
            url: '/contacts/' + id,
            success: response => {
                alert('Видалення контактів')
                window.location.href='/about'
            },
            error: err => console.log(err)
        })
    }))

$(document).ready(() => 
    $('.delete-home').on('click', e => {
        $target = $(e.target)
        const id = $target.attr('data-id')
        $.ajax({
            type: 'DELETE',
            url: '/homepage/' + id,
            success: response => {
                alert('Видалення опису')
                window.location.href='/'
            },
            error: err => console.log(err)
        })
    }))

CKEDITOR.replace('editor')