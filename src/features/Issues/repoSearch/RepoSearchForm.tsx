import React, { useState, ChangeEvent } from 'react';

interface RSFProps {
  org: string
  repo: string
  setOrgAndRepo: (org: string, repo: string) => void
  setJumpToPage: (page: number) => void
  setInvalidateQuery: (page: number) => void
  setInvalidateRepo: () => void
}

type InputEvent = ChangeEvent<HTMLInputElement>
type ChangeHandler = (e: InputEvent) => void

export const RepoSearchForm = ({
  org,
  repo,
  setOrgAndRepo,
  setJumpToPage,
  setInvalidateQuery,
  setInvalidateRepo
}: RSFProps) => {
  const [currentOrg, setCurrentOrg] = useState(org)
  const [currentRepo, setCurrentRepo] = useState(repo)
  const [currentPageText, setCurrentPageText] = useState('1')

  const onOrgChanged: ChangeHandler = e => {
    setCurrentOrg(e.target.value)
  }

  const onRepoChanged: ChangeHandler = e => {
    setCurrentRepo(e.target.value)
  }

  const onCurrentPageChanged: ChangeHandler = e => {
    setCurrentPageText(e.target.value)
  }

  const onLoadRepoClicked = () => {
    setOrgAndRepo(currentOrg, currentRepo)
  }

  const onJumpToPageClicked = () => {
    const newPage = parseInt(currentPageText)

    if (newPage >= 1) {
      setJumpToPage(newPage)
    }
  }

  const onInvalidateQueryClicked = () => {
    const page = parseInt(currentPageText)
    setInvalidateQuery(page);
  };

  const onInvalidateRepoClicked = () => {
    setInvalidateRepo();
  };

  return (
    <form className="pure-form">
      <div>
        <label htmlFor="org" style={{ marginRight: 5 }}>
          Org:
        </label>
        <input name="org" value={currentOrg} onChange={onOrgChanged} />
        <label htmlFor="repo" style={{ marginRight: 5, marginLeft: 10 }}>
          Repo:
        </label>
        <input name="repo" value={currentRepo} onChange={onRepoChanged} />
        <button
          type="button"
          className="pure-button pure-button-primary"
          style={{ marginLeft: 5 }}
          onClick={onLoadRepoClicked}
        >
          Load Repo
        </button>
        <button
          type="button"
          className="pure-button pure-button-primary"
          style={{ marginLeft: 5 }}
          onClick={onInvalidateRepoClicked}
        >
          Invalidate repo
        </button>
      </div>
      <div style={{ marginTop: 5 }}>
        <label htmlFor="jumpToPage" style={{ marginRight: 5 }}>
          Issues Page:
        </label>
        <input
          name="jumpToPage"
          value={currentPageText}
          onChange={onCurrentPageChanged}
        />
        <button
          type="button"
          className="pure-button pure-button-primary"
          style={{ marginLeft: 5 }}
          onClick={onJumpToPageClicked}
        >
          Jump to Page
        </button>
        <button
          type="button"
          className="pure-button pure-button-primary"
          style={{ marginLeft: 5 }}
          onClick={onInvalidateQueryClicked}
        >
          Invalidate query
        </button>
      </div>
    </form>
  )
}
